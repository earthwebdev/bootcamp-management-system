import { registerUser } from "../controllers/users.controller"
import User from "../models/users.model";

describe('register', () => {
    it('should crate a new user if the email is not registered', async() => {
        const req = {
            body:{
                name: 'Peter',
                email: 'peter@email.com',
                password: 'Peter123'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
        User.findOne = jest.fn.mockReturnValue(null);
        User.prototype.save = jest.fn().mockReturnValueOnce();
        await registerUser(req, res);

        expect(User.findOne).toHaveBeenCalledWith({email:req.body.email});
        expect(User.prototype.save).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.json).toHaveBeenCalledWith({
            status: true,
            data: expect.any(Object),
            message: 'User created Successfully',
        })
        //npm run test
    })
})