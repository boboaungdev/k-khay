import { APP_INFO } from "@/constatnts"

export function welcomeTemplate(name: string) {
  return `
    <h2>Welcome to ${APP_INFO.appName}, ${name}</h2>
    <p>Your account is ready.</p>
  `
}
