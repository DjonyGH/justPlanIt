db.createUser({
  user: 'admin',
  pwd: 'admin',
  roles: [
    {
      role: 'readWrite',
      db: 'just_plan_it',
    },
  ],
});
db.collection.getPlanCache().clear();
