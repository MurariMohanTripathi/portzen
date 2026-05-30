# PortZen Admin Firestore Structure

Create this document manually in Cloud Firestore to grant admin access. There is no admin signup page.

Collection: `admins`

Document ID: `murari`

Fields:

```js
{
  username: "murari",
  email: "tripathimurari599@gmail.com",
  active: true,
  role: "superadmin",
  displayName: "Murari Tripathi",
  createdAt: serverTimestamp,
  updatedAt: serverTimestamp
}
```

Then open the hidden admin route:

```txt
https://portzen.in/admin/murari
```

The admin must also be signed in through Firebase Auth using the same email and password. A normal user can also be an admin only when their email is present in the `admins` collection with `active: true`.
