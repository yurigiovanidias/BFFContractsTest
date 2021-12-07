let authHeader = null;
// const postsSchema = Joi.array().items(
//     Joi.object().keys({
//         userId: Joi.number(),
//         id: Joi.number(),
//         title: Joi.string(),
//         body: Joi.string()
//     })
// );

const postsSchema = Joi.object().keys({
    order: Joi.array(),
    posts: Joi.object()
});

suite("GET /posts", () => {
    suiteSetup(async () => {
        console.info("Getting auth token to authorizing on next tests");

        const res = await authRequest
            .post("")
            .send({
                login_id: "yuri.dornelas@tc.com.br",
                password: "A12345678",
            });
        authHeader = `BEARER ${res.body.data.token}`;
    });

    test("Should get pots", async () => {
        try {
            const res = await request
                .get("/posts?engine=elastic")
                .set('Authorization', authHeader)
                .expect("Content-Type", /json/)
                .expect(200);

            validatePostsSchema(res.body);
        }
        catch (e) {
            throw new Error(e.message);
            return;
        }
    });

    test("Should get posts with no content", async () => {
        try {
            const res = await request
                .get("/posts?tickers=ERROR1&engine=elastic")
                .set('Authorization', authHeader)
                .expect(204);
        }
        catch (e) {
            throw new Error(e.message);
            return;
        }
    });

    test("Should get posts by unique sources", async () => {
        try {
            const sourceQuery = "Folha";
            const response = await request
                .get("/posts?engine=elastic")
                .query({
                    sources: sourceQuery
                })
                .set('Authorization', authHeader)
                .expect("Content-Type", /json/)
                .expect(200);

            const result = response.body;
            const post = Object.values(result.posts).find(post => {
                return post.font !== sourceQuery
            });

            if (typeof post !== "undefined") {
                throw new Error("Post with font diff to Folha");
            }
        }
        catch (e) {
            throw new Error(e.message);
            return;
        }
    })
});

const validatePostsSchema = (posts) => {
    const validation = postsSchema.validate(posts)

    if (validation.error) {
        throw new Error(validation.error.details[0].message);
        return;
    }
};
