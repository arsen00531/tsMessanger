import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const getPath = (): string => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    return path.join(__dirname, '..', '..', 'views', 'pages', )
}

export {getPath}