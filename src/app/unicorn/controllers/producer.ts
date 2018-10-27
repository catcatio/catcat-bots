import { Producer } from '../models'

const getById = async (id) => {
  return Producer.findById(id)
}

const getByEmail = async (email) => {
  return Producer.findOne({ where: { email } })
}

const newProducer = async (email: string, displayName: string, pictureUrl: string, providers: any) => {
  return Producer.create<Producer>({
    email,
    displayName,
    pictureUrl,
    providers
  })
}

export default {
  getById,
  newProducer,
  getByEmail
}
