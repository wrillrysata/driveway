const router = (app) => {
    app.get('/', (req, res) => {
      res.status(200)
        .send('Welcome to Driveway app');
    });
}
export default router;
