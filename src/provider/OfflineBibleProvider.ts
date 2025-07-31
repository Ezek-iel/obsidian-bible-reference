import { BaseBibleAPIProvider } from './BaseBibleAPIProvider';
import { IVerse } from 'src/interfaces/IVerse';
import { IBibleVersion } from 'src/interfaces/IBibleVersion';
import BibleReferencePlugin from 'src/main';
import { normalizePath } from 'obsidian';

export class OfflineBibleProvider extends BaseBibleAPIProvider {

   
    /**
     * This argument is needed for reading from files
     */
    plugin: BibleReferencePlugin
    public constructor (bibleVersion: IBibleVersion, plugin: BibleReferencePlugin) {
        super(bibleVersion)
        this.plugin = plugin
    }

    protected prepareVerseLinkUrl(): string {
        // Offline provider does not prepare a verse link URL
        return "";
    }

    protected buildRequestURL(
        bookName: string,
        chapter: number,
        verses?: number[],
        versionName?: string
    ): string {
        // Offline provider does not need to build a request URL
        return '';
    }

    protected formatBibleVerses(
        data: { reference: string; verses: IVerse[] } | Array<object>,
        bookName: string,
        chapter: number,
        verse: number[],
        versionName: string
    ): IVerse[] {
        // Offline provider does not format verses, it returns an empty array
        return [];
    }

    private async loadBibleData() {
        const path = `${this.plugin.manifest.dir}/KJV.json`
        const {adapter} = this.plugin.app.vault

        const data = await adapter.read(normalizePath(path))
        return JSON.parse(data)
    }
    public async query(bookName: string, chapter: number, verse: number[]) {

        console.log("I am being called.... <3")
        console.log(bookName, chapter, verse)

        const bibleData = await this.loadBibleData()
        const result: IVerse[] = []

        console.log(bibleData)

        const start = verse[0]
        const end = verse[1] ? verse[1] : verse[0]

        for (let i = start; i <= end; i++) {
            console.log(i)
            for (const index in bibleData) {
                if (Object.keys(bibleData[index])[0] === bookName) {
                    const text = bibleData[index][bookName][chapter - 1][chapter - 1][i - 1]
                    console.log(text)
                    result.push({ book_name: bookName, chapter: chapter, verse: i, text: text })
                }
            }
        }

        console.log(result)

        return result
    }


}