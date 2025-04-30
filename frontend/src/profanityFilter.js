import leoProfanity from 'leo-profanity'

const defaultList = leoProfanity.list()
leoProfanity.loadDictionary('ru')
leoProfanity.add(defaultList)

export default leoProfanity
