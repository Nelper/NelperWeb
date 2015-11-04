export default function getAsset(path: string): string {
  return require('../' + path);
}
