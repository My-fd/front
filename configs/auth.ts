import Credentials from 'next-auth/providers/credentials';
import axios from "axios";

export const authConfig: any = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      id: 'signIn',
      name: 'signIn',
      credentials: {
        email: { label: 'email', type: 'email', required: true },
        password: { label: 'password', type: 'password', required: true },
      },
      async authorize(credentials) {
        return postRequest({credentials, path: process.env.API_PATH_SIGNIN})
      }
    }),
    Credentials({
      id: 'signUp',
      name: 'signUp',
      credentials: {
        nickname: { label: 'nickname', type: 'nickname', required: true },
        email: { label: 'email', type: 'email', required: true },
        password: { label: 'password', type: 'password', required: true },
        password_confirmation: { label: 'password_confirmation', type: 'password_confirmation', required: true },
      },
      async authorize(credentials) {
        return postRequest({credentials, path: process.env.API_PATH_SIGNUP})
      }
    })
  ],
  callbacks:{
    async signIn(props) {
      const { user } = props
      return user
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session(props) {
      const { session, token} = props
      const user = token?.user
      session.accessToken = token.accessToken
      session.user = {...user.data}
      return session
    }
  },
  pages: {
      signIn: '/signin',
    signOut: (process.env.API_URL || '') + '/',
    error: (process.env.API_URL || '') + '/'
  }
}

async function postRequest(props) {
  const {credentials, path} = props
  const user = await axios
      .post(process.env.API_URL + path, credentials)
      .then(({ data }) => {
        return data;
      })
      .catch((error) => {
        throw  error.response.data
      });

  return user ;
}