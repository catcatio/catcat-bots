import { Registration } from '../models'

const getById = async (id) => {
  return Registration.findById(id)
}

const newRegistration = async (email: string, role: string, detail: any) => {
  const key = `${role}-${email}`
  return Registration.create<Registration>({
    key,
    detail,
  })
}

const setApprovalResult = async (id: string, approved: boolean) => {
  const registration = await getById(id)
  return registration.update({approved})
}

export default {
  getById,
  newRegistration,
  setApprovalResult
}
