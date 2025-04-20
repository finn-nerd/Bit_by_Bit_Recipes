import { parseCookies } from 'nookies';

export async function getServerSideProps(ctx) {
  // Read cookies on the server
  const { token } = parseCookies(ctx);

  return {
    redirect: {
      destination: token ? '/home' : '/login',
      permanent: false,
    },
  };
}

export default function Index() {
    return null;
  };