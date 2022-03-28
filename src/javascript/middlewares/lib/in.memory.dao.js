"use strict";
/*
const {nanoid} = require('nanoid');

class GenericInMemoryDao {
    static instance;
    users= [];

    constructor() {
        console.log('Created new instance of GenericInMemoryDao');
    }

    static getInstance(){
        if (!GenericInMemoryDao.instance) {
            GenericInMemoryDao.instance = new GenericInMemoryDao();
        }
        return GenericInMemoryDao.instance;
    }

    addUser(user) {
        return new Promise((resolve) => {
            user.id = nanoid();
            this.users.push(user)
            resolve(user.id);
        });
    }

    getUsers() {
        return new Promise((resolve) => {
            resolve(this.users);
        });
    }

    getUserById(userId) {
        return new Promise((resolve) => {
            resolve(this.users.find((user) => user.id === userId));
        });
    }

    putUserById(user) {
        const objIndex = this.users.findIndex((obj) => obj.id === user.id);
        this.users = [
            ...this.users.slice(0, objIndex),
            user,
            ...this.users.slice(objIndex + 1),
        ];
        return new Promise((resolve) => {
            resolve(`${user.id} updated via put`);
        });
    }

    patchUserById(user) {
        const objIndex = this.users.findIndex((obj) => obj.id === user.id);
        let currentUser = this.users[objIndex];
        for (let i in user) {
            if (i !== 'id') {
                currentUser[i] = user[i];
            }
        }
        this.users = [
            ...this.users.slice(0, objIndex),
            currentUser,
            ...this.users.slice(objIndex + 1),
        ];
        return new Promise((resolve) => {
            resolve(`${user.id} patched`);
        });
    }


    removeUserById(userId) {
        const objIndex = this.users.findIndex((obj) => obj.id === userId);
        this.users = this.users.splice(objIndex, 1);
        return new Promise((resolve) => {
            resolve(`${userId} removed`);
        });
    }

    getByEmail(email) {
        return new Promise((resolve) => {
            const objIndex = this.users.findIndex((obj) => obj.email === email);
            let currentUser = this.users[objIndex];
            if (currentUser) {
                resolve(currentUser);
            } else {
                resolve(null);
            }
        });
    }
}

exports.GenericInMemoryDao = GenericInMemoryDao;

*/
