import eslint from '@jiangweiye/eslint-config';

export default eslint({
    typescript: true,
    rules: {
        'ts/no-unused-expressions': 'off'
    }
});
