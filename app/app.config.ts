export default defineAppConfig({
  title: 'YesCandles',
  defaultCountry: 'pl',
  defaultProductsPerPage: 12,
  homepageCollections: ['polecane'],
  ui: {
    colors: {
      primary: 'pink',
      neutral: 'zinc',
    },
    button: {
      rounded: 'rounded-md',
      default: {
        size: 'sm',
        variant: 'solid',
        color: 'primary',
      },
      primary: {
        class: 'bg-gradient-to-r from-pink-500 to-pink-300 hover:from-pink-600 hover:to-pink-400 text-white font-medium'
      }
    },
    card: {
      rounded: 'rounded-md',
      shadow: 'shadow-sm',
      body: {
        padding: 'p-4',
      },
    },
    input: {
      rounded: 'rounded-md',
      color: {
        white: {
          outline: 'focus:ring-pink-500 focus:border-pink-500',
        }
      }
    },
    accordion: {
      slots: {
        root: 'w-full',
        item: 'last:border-b-1 border border-pink-400 bg-pink-100/60 rounded-xl px-8 my-2',
        header: 'flex',
        trigger: 'group flex-1 flex items-center gap-1.5 font-medium text-sm py-3.5 focus-visible:outline-primary min-w-0',
        content: 'text-pink-900 mb-3 data-[state=open]:animate-[accordion-down_200ms_ease-out] data-[state=closed]:animate-[accordion-up_200ms_ease-out] overflow-hidden focus:outline-none',
        body: 'text-sm pb-3.5',
        leadingIcon: 'shrink-0 size-12 text-2xl text-pink-800',
        trailingIcon: 'shrink-0 size-5 ms-auto group-data-[state=open]:rotate-180 transition-transform duration-200',
        label: 'text-start break-words text-lg text-pink-700'
      },
      variants: {
        disabled: {
          true: {
            trigger: 'cursor-not-allowed opacity-75'
          }
        }
      }
    },
  },
})
