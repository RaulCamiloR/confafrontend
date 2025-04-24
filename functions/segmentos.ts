export const getSegmentos = async (channelType: string, page: number, pageSize: number, forDropdown: boolean) => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/segment/segments?channelType=${channelType}&page=${page}&pageSize=${pageSize}&forDropdown=${forDropdown}`)

    const data = await response.json()

    console.log({data})
  
    return data
}