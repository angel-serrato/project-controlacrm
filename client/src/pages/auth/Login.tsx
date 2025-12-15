function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <p>
        <a href="/forgot-password">Forgot your password?</a>
      </p>
      <p>
        <a href="/register">You do not have an account? Register</a>
      </p>
    </div>
  );
}

export default LoginPage;
