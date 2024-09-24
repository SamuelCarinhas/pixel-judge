export interface ILanguage {
    id: string,
    fileExtension: string,
    compile: boolean,
    compileCommand: string,
    runCommand: string
}