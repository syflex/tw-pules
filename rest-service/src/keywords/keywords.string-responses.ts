export class KeywordStringResponses {
  static badInputResponse(keyword: string): string {
    return `${keyword}: Only alphabets are allowed for tracking.`;
  }

  static existingKeywordResponse(keyword: string): string {
    return `${keyword} already exists in the system.`;
  }
}
