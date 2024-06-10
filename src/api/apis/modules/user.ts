import fetch from "@/api/fetch";

async function loginUser(data: authDto) {
  const res = await fetch.post('/auth/login', data)
    .catch(error => {
      return error.response
    })
  return res.data
}

async function registerUser(data: authDto) {
  const res = await fetch.post('/auth/register', data)
    .catch(error => {
      return error.response
    })

  return res.data
}

async function initUserData() {
  const res = await fetch.get('/user/allData')
    .catch(error => {
      return error.response
    })
  return res.data
}


export { loginUser, registerUser, initUserData }