import { api } from './axios-client'

export const imageService = {
  async upload(file: File): Promise<{ url: string; publicId: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  },

  async delete(publicId: string): Promise<void> {
    await api.delete(`/images/${encodeURIComponent(publicId)}`)
  },
}
