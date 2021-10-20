const schema = new Schema({ firstName: String, lastName: String });

class PersonClass {
  // `fullName` becomes a virtual
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  set fullName(v) {
    const firstSpace = v.indexOf(' ');
    this.firstName = v.split(' ')[0];
    this.lastName = firstSpace === -1 ? '' : v.substr(firstSpace + 1);
  }

  // `getFullName()` becomes a document method
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // `findByFullName()` becomes a static
  static findByFullName(name) {
    const firstSpace = name.indexOf(' ');
    const firstName = name.split(' ')[0];
    const lastName = firstSpace === -1 ? '' : name.substr(firstSpace + 1);
    return this.findOne({ firstName, lastName });
  }
}

schema.loadClass(PersonClass);
var Person = db.model('Person', schema);

Person.create({ firstName: 'Jon', lastName: 'Snow' }).
  then(doc => {
    assert.equal(doc.fullName, 'Jon Snow');
    doc.fullName = 'Jon Stark';
    assert.equal(doc.firstName, 'Jon');
    assert.equal(doc.lastName, 'Stark');
    return Person.findByFullName('Jon Snow');
  }).
  then(doc => {
    assert.equal(doc.fullName, 'Jon Snow');
  });

  ///////////////
  /* this is our initial value i.e. the starting point*/
const initialValue = 0;

/* numbers array */
const numbers = [5, 10, 15];

/* reducer method that takes in the accumulator and next item */
const reducer = (accumulator, item) => {
  return accumulator + item;
};

/* we give the reduce method our reducer function
  and our initial value */
const total = numbers.reduce(reducer, initialValue)