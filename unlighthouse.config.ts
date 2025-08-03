export default {
  site: 'https://bd-theme-nu.vercel.app',
  scanner: {
    // Number of concurrent workers
    throttle: true,
    // Sample size of pages to scan
    samples: 10,
    // Device to emulate
    device: 'desktop',
    // Exclude specific routes
    exclude: [
      '/api/*',
      '/admin/*',
      '/dashboard/*',
      '/_next/*',
      '/studio/*'
    ],
    // Include specific routes (higher priority)
    include: [
      '/',
      '/menu',
      '/about',
      '/contact',
      '/blog',
      '/auth/signin',
      '/auth/signup'
    ]
  },
  debug: false,
  // Output directory
  outputPath: '.unlighthouse',
  // Lighthouse configuration
  lighthouse: {
    options: {
      // Performance budget
      onlyCategories: [
        'performance',
        'accessibility',
        'best-practices',
        'seo'
      ],
      // Throttling settings
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1
      }
    }
  },
  // Discovery options
  discovery: {
    // Sitemap URL
    sitemap: '/sitemap.xml',
    // Robots.txt
    robots: '/robots.txt'
  },
  // CI mode configuration
  ci: {
    // Build budget assertions
    budget: {
      performance: 90,
      accessibility: 90,
      'best-practices': 90,
      seo: 90
    },
    // Upload results
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-reports'
    }
  },
  // Chrome flags for better performance testing
  chrome: {
    useSystem: true,
    chromePath: undefined
  },
  // Hooks
  hooks: {
    // Before scanning
    'scanner:before': () => {
      console.log('Starting Lighthouse performance scan...')
    },
    // After page scan
    'page-report': (report: any) => {
      const { page, report: { categories } } = report
      console.log(`✓ ${page.route} - Performance: ${categories.performance.score * 100}`)
    },
    // After all scans
    'scanner:after': () => {
      console.log('Performance scan completed!')
    }
  }
}