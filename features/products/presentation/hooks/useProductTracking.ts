'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import { productContainer } from '../../infrastructure/di/ProductContainer'
import type { TrackProductViewRequest } from '../../application/use-cases/TrackProductView'

/**
 * Hook to track product views with debouncing and deduplication
 */
export function useProductTracking() {
  const queryClient = useQueryClient()
  const trackedViews = useRef(new Set<string>())
  const trackingTimers = useRef(new Map<string, NodeJS.Timeout>())

  const trackViewMutation = useMutation({
    mutationFn: async (request: TrackProductViewRequest) => {
      const useCase = productContainer.trackProductView()
      const response = await useCase.execute(request)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to track product view')
      }
      
      return response.data
    },
    onSuccess: (data, variables) => {
      // Invalidate product popularity queries after successful tracking
      queryClient.invalidateQueries({ 
        queryKey: ['product-popularity', variables.productId] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['favorite-products', { source: 'analytics' }] 
      })
    },
    onError: (error) => {
      console.error('Failed to track product view:', error)
      // Fail silently - tracking shouldn't impact user experience
    }
  })

  /**
   * Track a product view with debouncing to avoid excessive API calls
   */
  const trackProductView = useCallback((request: TrackProductViewRequest) => {
    const { productId, userId, sessionId } = request
    
    // Create a unique key for deduplication
    const viewKey = `${productId}-${userId || sessionId || 'anonymous'}`
    
    // Skip if already tracked in this session
    if (trackedViews.current.has(viewKey)) {
      return
    }

    // Clear existing timer for this product
    const existingTimer = trackingTimers.current.get(productId)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    // Set new timer with debouncing (500ms)
    const timer = setTimeout(() => {
      trackedViews.current.add(viewKey)
      trackingTimers.current.delete(productId)
      
      // Get additional context
      const trackingData: TrackProductViewRequest = {
        ...request,
        ipAddress: request.ipAddress || undefined, // Will be determined server-side if not provided
        userAgent: request.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : undefined)
      }
      
      trackViewMutation.mutate(trackingData)
    }, 500)

    trackingTimers.current.set(productId, timer)
  }, [trackViewMutation])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      trackingTimers.current.forEach(timer => clearTimeout(timer))
      trackingTimers.current.clear()
    }
  }, [])

  return {
    trackProductView,
    isTracking: trackViewMutation.isPending
  }
}

/**
 * Hook to automatically track product view when component mounts
 */
export function useAutoTrackProductView(
  productId: string | undefined,
  userId?: string,
  sessionId?: string,
  options: {
    enabled?: boolean
    delay?: number
  } = {}
) {
  const { enabled = true, delay = 1000 } = options
  const { trackProductView } = useProductTracking()
  const hasTracked = useRef(false)

  useEffect(() => {
    if (!productId || !enabled || hasTracked.current) {
      return
    }

    const timer = setTimeout(() => {
      trackProductView({
        productId,
        userId,
        sessionId
      })
      hasTracked.current = true
    }, delay)

    return () => clearTimeout(timer)
  }, [productId, userId, sessionId, enabled, delay, trackProductView])

  // Reset tracking flag when productId changes
  useEffect(() => {
    hasTracked.current = false
  }, [productId])
}

/**
 * Hook to get product analytics data
 */
export function useProductAnalytics(productId: string | undefined) {
  return useQuery({
    queryKey: ['product-analytics', productId],
    queryFn: async () => {
      if (!productId) throw new Error('Product ID is required')
      
      // This would typically call a use case or API endpoint
      const response = await fetch(`/api/products/${productId}/analytics`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch product analytics')
      }
      
      return response.json()
    },
    enabled: !!productId,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get view count for a specific product
 */
export function useProductViewCount(productId: string | undefined) {
  return useQuery({
    queryKey: ['product-view-count', productId],
    queryFn: async () => {
      if (!productId) throw new Error('Product ID is required')
      
      const response = await fetch(`/api/products/${productId}/view-count`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch view count')
      }
      
      const data = await response.json()
      return data.count
    },
    enabled: !!productId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook to check if a product is favorited by the current user
 */
export function useIsProductFavorited(productId: string | undefined, userId: string | undefined) {
  return useQuery({
    queryKey: ['is-product-favorited', productId, userId],
    queryFn: async () => {
      if (!productId || !userId) return false
      
      const response = await fetch(`/api/products/${productId}/is-favorited?userId=${userId}`)
      
      if (!response.ok) {
        return false // Fail gracefully
      }
      
      const data = await response.json()
      return data.isFavorited
    },
    enabled: !!productId && !!userId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  })
}