import { BibleReferencePluginSettings } from '../data/constants'
import { VerseSuggesting } from '../verse/VerseSuggesting'
import { BOOK_REG } from './regs'
import { getFullBookName } from './bookNameReference'
import { getBibleVersion } from '../data/BibleVersionCollection'
import BibleReferencePlugin from "src/main"

/**
 * Get suggestions from string query
 * @param queryWithoutPrefix without the prefix trigger
 * @param settings
 */
export const getSuggestionsFromQuery = async (
  queryWithoutPrefix: string,
  settings: BibleReferencePluginSettings,
  plugin: BibleReferencePlugin,
  translation?: string,
): Promise<VerseSuggesting[]> => {
  //!Console.log for the time being
  console.log(
    'get suggestion for query ',
    queryWithoutPrefix.toLowerCase(),
    translation,
    settings.bibleVersion,
    settings.defaultBibleVersion
  )

  const bookNameMatchingResults = queryWithoutPrefix.match(BOOK_REG)
  const rawBookName = bookNameMatchingResults?.length
    ? bookNameMatchingResults[0]
    : undefined

  if (!rawBookName) {
    console.error(`could not find through query`, queryWithoutPrefix)
    return []
  }

  const numbersPartsOfQueryString = queryWithoutPrefix.substring(
    rawBookName.length
  )
  const numbers = numbersPartsOfQueryString.split(/[-:]+/)

  const chapterNumber = parseInt(numbers[0].trim())
  const verseNumber = parseInt(numbers[1])
  const verseEndNumber = numbers.length === 3 ? parseInt(numbers[2]) : undefined

  const selectedBibleVersion = getBibleVersion(
    translation ? translation : settings.bibleVersion
  )
  // !Console.log here again
  console.log(selectedBibleVersion)
  const bookName = getFullBookName(rawBookName, selectedBibleVersion?.code)
  console.debug('selected bookName', bookName)

  // todo get bibleVersion and language from settings
  const suggestingVerse = new VerseSuggesting(
    settings,
    bookName,
    plugin,
    chapterNumber,
    verseNumber,
    verseEndNumber,
  )

  console.debug(
    bookName,
    chapterNumber,
    verseNumber,
    verseEndNumber,
    suggestingVerse,
    settings
  )
  await suggestingVerse.fetchAndSetVersesText()
  return [suggestingVerse]
}
