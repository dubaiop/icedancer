// Utility function for combining class names
// Simplified version that doesn't depend on external packages
export function cn(...inputs) {
  const classes = []
  
  for (const input of inputs) {
    if (!input) continue
    
    if (typeof input === 'string') {
      classes.push(input)
    } else if (Array.isArray(input)) {
      const result = cn(...input)
      if (result) classes.push(result)
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) classes.push(key)
      }
    }
  }
  
  // Remove duplicates and return
  return [...new Set(classes.join(' ').split(' ').filter(Boolean))].join(' ')
} 