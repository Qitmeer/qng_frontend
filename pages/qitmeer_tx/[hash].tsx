import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';
const Transaction = dynamic(() => import('ui/pages/UTXOTransaction'), {
  ssr: false,
});
const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/qitmeer_tx/[hash]" query={ props.query }>
      <Transaction/>
    </PageNextJs>
  );
};
export default Page;
export { base as getServerSideProps } from 'nextjs/getServerSideProps';
