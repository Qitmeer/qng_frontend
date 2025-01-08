import React from 'react';

import type { UTXOTransaction } from 'types/api/qitmeer_tx';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import { publicClient } from 'lib/web3/client';
import TextAd from 'ui/shared/ad/TextAd';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
import useTabIndexFromQuery from 'ui/shared/Tabs/useTabIndexFromQuery';
import useUTXOTxQuery from 'ui/tx/useUTXOTxQuery';
import UTXOTxDetailsWrapped from 'ui/tx/UTXOTxDetailsWrapped';

const UTXOTransactionPageContent = () => {

  const txQuery = useUTXOTxQuery();
  const { data, isPlaceholderData, isError, error, errorUpdateCount } = txQuery;

  const showDegradedView = publicClient && ((isError && error.status !== 422) || isPlaceholderData) && errorUpdateCount > 0;

  const tabs: Array<RoutedTab> = (() => {
    return [ { id: 'wrapped', title: 'Regular tx details', component: <UTXOTxDetailsWrapped data={ data as UTXOTransaction }/> },
    ].filter(Boolean);
  })();

  const tabIndex = useTabIndexFromQuery(tabs);

  const content = (() => {
    if (isPlaceholderData && !showDegradedView) {
      return (
        <>
          <TabsSkeleton tabs={ tabs } mt={ 6 }/>
          { tabs[tabIndex]?.component }
        </>
      );
    }

    return <RoutedTabs tabs={ tabs }/>;
  })();

  if (isError && !showDegradedView) {
    if (isCustomAppError(error)) {
      throwOnResourceLoadError({ resource: 'tx', error, isError: true });
    }
  }

  return (
    <>
      <TextAd mb={ 6 }/>
      { content }
    </>
  );
};

export default UTXOTransactionPageContent;
