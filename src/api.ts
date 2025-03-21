import axios from "axios"
import { logger } from "."

let cancelTokens: any = {}

export let cookie = {
  JSESSIONID: "",
  array: ""
}

export async function api(target: string, params: any) {

  if (cancelTokens[target + JSON.stringify(params)]) {
    cancelTokens[target + JSON.stringify(params)]()
  }

  let source = axios.CancelToken.source()
  cancelTokens[target + JSON.stringify(params)] = source.cancel
  if (params) {
    params = { ...params, j: cookie.JSESSIONID, a: cookie.array }
  } else {
    params = { j: cookie.JSESSIONID, a: cookie.array }
  }

  let queryString = params ? Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&') : ''

  const baseURL = "http://127.0.0.1:3000/api"

  const methodMap: any = {
    "/studentui/initstudinfo": "GET",
    "/dlsf/loginGetToken": "GET",
    "/selectcourse/initACC": "GET",
    "/selectcourse/scSubmit": "POST",
    "/common/semesterSS": "GET",
    "/StudentCourseTable/getData": "GET",
    "/dlsf/version": "GET",
    "/PublicQuery/getSelectCourseTermList": "GET",
    "/selectcourse/initSelCourses": "GET"
  }

  let config = {
    method: methodMap[target],
    url: baseURL + target + "?" + queryString,
    cancelToken: source.token
  }

  const request = new Promise((resolve, reject) => {
    axios(config)
      .then(function (response) {
        logger.info("API OK " + target + "?" + queryString)
        resolve(response.data)
      })
      .catch(function (error) {
        logger.errorRaw("API ERROR " + target + "?" + queryString, error.cause)
        reject(error)
      })
  })

  return request

}
