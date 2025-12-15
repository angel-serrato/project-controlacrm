function ForgotPasswordPage() {
  return (
    <div>
      <h1>Forgot Password</h1>
      <form>
        <input type="email" placeholder="Enter your email" />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
