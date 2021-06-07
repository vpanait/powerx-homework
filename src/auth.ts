// Fake password-checking function with artificial delay
export function checkPassword(
  username: string,
  password: string
): Promise<boolean> {
  return new Promise((y) => setTimeout(() => y(username === password), 1000));
}
