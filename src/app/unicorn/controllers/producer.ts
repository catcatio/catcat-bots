import { Producer } from '../models'

const getById = async (id) => {
  return Producer.findById(id)
}

const newProducer = async (email: string, displayName: string, displayImageUrl: string, providers: any) => {
  return Producer.create<Producer>({
    email,
    displayName,
    displayImageUrl
  })
}

export default {
  getById,
  newProducer,
}
