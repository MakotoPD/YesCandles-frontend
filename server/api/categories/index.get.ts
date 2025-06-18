import { serverMedusaClient } from '#medusa/server'

export default defineWrappedResponseHandler(async (event) => {
  const medusa = serverMedusaClient(event)
  const query = getQuery(event)

  return await medusa.store.category.list({
    ...query,
  })
})
