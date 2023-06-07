import en from './en'
import th from './th'

type Messages = {
  [key: string]: Record<string, string>
}

const messages: Messages = {
  en,
  th,
}

export default messages
