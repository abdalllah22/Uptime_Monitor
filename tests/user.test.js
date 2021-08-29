const request = require('supertest')
const app = require('../app')
const User = require('../models/user')
const { userOneId, userOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'ahmed',
        email: 'aabdalllah22@gmail.com',
        password: 'zxzx1212'
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body.user.name).toBe('ahmed')

    expect(response.body).toMatchObject({
        user:{
            name: 'ahmed',
            email: 'aabdalllah22@gmail.com',
        },
        // token:user.tokens[0].token
    })
})

test('Should not login without verify', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(404)
    
    // const user = await User.findById(userOneId)
    // expect(response.body.token).toBe(user.tokens[1].token)
})

test('verify account before login', async () => {
    await request(app)
            .get(`/users/verify-email?token=${userOne.tokens[0].token}&id=${userOne._id}`)
            .send()
            .expect(200)
            
})

test('Should not login', async () => {
    await request(app)
            .post('/users/login')
            .send({
                email: userOne.email,
                password: 'not my password'
            })
            .expect(400)
})

test('Should not Get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should get account for user', async () => {
    await request(app)
        .get(`/users/me`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
})

test('Should delete account for user', async () => {
    await request(app)
        .delete(`/users/me`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})
test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'abdallah'
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('abdallah')
})
