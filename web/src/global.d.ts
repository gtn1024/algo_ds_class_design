interface HttpResponse<T = unknown> {
  code: number
  message: string
  data: T
}

interface Student {
  id: string
  name: string
  mathScore: number
  englishScore: number
  physicsScore: number
  sum: number
  rank: number
}
