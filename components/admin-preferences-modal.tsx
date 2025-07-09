'use client'

import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Settings } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { MultiSelect } from '@/components/ui/multi-select'
import { useAdminPreferences, useUpdateAdminPreferences } from '@/hooks/use-admin-preferences'
import {
  AdminPreferencesFormSchema,
  AVAILABLE_LANGUAGES,
  type AdminPreferencesForm,
} from '@/lib/schemas'

interface AdminPreferencesModalProps {
  children?: React.ReactNode
}

export function AdminPreferencesModal({ children }: AdminPreferencesModalProps) {
  const [open, setOpen] = useState(false)
  const { data: preferences, isLoading } = useAdminPreferences()
  const updatePreferences = useUpdateAdminPreferences()
  const initializedRef = useRef(false)

  const form = useForm<AdminPreferencesForm>({
    resolver: zodResolver(AdminPreferencesFormSchema),
    defaultValues: {
      isMultilingual: false,
      supportedLanguages: ['fr'],
      defaultLanguage: 'fr',
    },
  })

  const isMultilingual = form.watch('isMultilingual')

  // Initialiser le formulaire une seule fois quand les préférences sont chargées
  useEffect(() => {
    if (preferences && !initializedRef.current) {
      form.reset({
        isMultilingual: preferences.isMultilingual,
        supportedLanguages: preferences.supportedLanguages,
        defaultLanguage: preferences.defaultLanguage,
      })
      initializedRef.current = true
    }
  }, [preferences, form])

  // Réinitialiser lors de la fermeture du modal
  useEffect(() => {
    if (!open) {
      initializedRef.current = false
    }
  }, [open])

  const onSubmit = (data: AdminPreferencesForm) => {
    updatePreferences.mutate(data, {
      onSuccess: () => {
        setOpen(false)
      },
    })
  }

  const handleMultilingualToggle = (checked: boolean) => {
    if (!checked) {
      // Mode monolingue : garder seulement la langue par défaut
      const defaultLang = form.getValues('defaultLanguage')
      form.setValue('supportedLanguages', [defaultLang])
    } else {
      // Mode multilingue : s'assurer d'avoir au moins 2 langues
      const currentLanguages = form.getValues('supportedLanguages')
      if (currentLanguages.length === 1) {
        const currentLang = currentLanguages[0]
        const secondLang = currentLang === 'fr' ? 'en' : 'fr'
        form.setValue('supportedLanguages', [currentLang, secondLang])
      }
    }
    // Mettre à jour le champ isMultilingual
    form.setValue('isMultilingual', checked)
  }

  const languageOptions = AVAILABLE_LANGUAGES.map((lang) => ({
    value: lang.code,
    label: lang.name,
  }))

  const supportedLanguages = form.watch('supportedLanguages')
  const availableDefaultLanguages = isMultilingual
    ? supportedLanguages
    : AVAILABLE_LANGUAGES.map((lang) => lang.code)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Préférences linguistiques
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Préférences linguistiques</DialogTitle>
          <DialogDescription>
            Configurez les langues de votre application et définissez vos préférences.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="isMultilingual"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Mode multilingue</FormLabel>
                    <FormDescription>
                      Activez si vous souhaitez prendre en charge plusieurs langues.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={handleMultilingualToggle}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {isMultilingual && (
              <FormField
                control={form.control}
                name="supportedLanguages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Langues supportées</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={languageOptions}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Sélectionner les langues..."
                      />
                    </FormControl>
                    <FormDescription>
                      Choisissez toutes les langues que vous souhaitez prendre en charge.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="defaultLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Langue par défaut</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la langue par défaut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AVAILABLE_LANGUAGES.filter((lang) =>
                        availableDefaultLanguages.includes(lang.code)
                      ).map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Langue principale de votre application.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || updatePreferences.isPending}
              >
                {updatePreferences.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 