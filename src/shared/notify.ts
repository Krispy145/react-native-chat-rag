import { Alert } from 'react-native'; export function notify(msg: string, title: string='Notice'){ Alert.alert(title, msg); }
