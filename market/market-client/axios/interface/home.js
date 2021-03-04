import axios from '../api'
export const home = () =>{
  return axios({
    url: 'home',
    method: 'get',
  })
}
