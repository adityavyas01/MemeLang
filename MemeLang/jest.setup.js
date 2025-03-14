// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Monaco Editor
jest.mock('@monaco-editor/react', () => ({
  Editor: ({ value, onChange }) => (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      role="textbox"
    />
  ),
})); 