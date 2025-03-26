/* eslint-disable max-len */
import { Flex } from '@chakra-ui/react';
import capitalize from 'lodash/capitalize';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import useNewTxsSocket from 'lib/hooks/useNewTxsSocket';
import getNetworkValidationActionText from 'lib/networks/getNetworkValidationActionText';
import getQueryParamString from 'lib/router/getQueryParamString';
import { UTXOTX } from 'stubs/tx';
import { generateListStub } from 'stubs/utils';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import QitmeerTxsWithFrontendSorting from 'ui/txs/QitmeerTxsWithFrontendSorting';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 6,
  marginTop: -5,
};
const TABS_HEIGHT = 88;

const UTXOTransactions = () => {
  const verifiedTitle = capitalize(getNetworkValidationActionText());
  const router = useRouter();
  const isMobile = useIsMobile();
  const tab = getQueryParamString(router.query.tab);

  const txsValidatedQuery = useQueryWithPages({
    resourceName: 'qitmeer_txs_validated',
    filters: { filter: 'validated' },
    options: {
      enabled: !tab || tab === 'validated',
      placeholderData: generateListStub<'qitmeer_txs_validated'>(UTXOTX as never, 50, {
        next_page_params: {
          block_number: 9005713,
          index: 5,
          items_count: 50,
          filter: 'validated',
        },
      } as never) as never,
    },
  });

  const txsPendingQuery = useQueryWithPages({
    resourceName: 'qitmeer_txs_pending',
    filters: { filter: 'pending' },
    options: {
      enabled: tab === 'pending',
      placeholderData: generateListStub<'txs_pending'>(UTXOTX as never, 50, { next_page_params: {
        inserted_at: '2024-02-05T07:04:47.749818Z',
        hash: '0x00',
        filter: 'pending',
      } }) as never,
    },
  });

  const { num, socketAlert } = useNewTxsSocket();

  const tabs: Array<RoutedTab> = [
    {
      id: 'validated',
      title: verifiedTitle,
      component: <QitmeerTxsWithFrontendSorting query={ txsValidatedQuery } showSocketInfo={ txsValidatedQuery.pagination.page === 1 } socketInfoNum={ num } socketInfoAlert={ socketAlert } top={ TABS_HEIGHT }/>,
    },
    {
      id: 'pending',
      title: 'Pending',
      component: <QitmeerTxsWithFrontendSorting query={ txsPendingQuery } showBlockInfo={ false } showSocketInfo={ txsPendingQuery.pagination.page === 1 } socketInfoNum={ num } socketInfoAlert={ socketAlert } top={ TABS_HEIGHT }/>,
    },
  ].filter(Boolean);

  const pagination = (() => {
    switch (tab) {
      case 'pending': return txsPendingQuery.pagination;
      default: return txsValidatedQuery.pagination;
    }
  })();

  const rightSlot = (() => {
    if (isMobile) {
      return null;
    }

    const isAdvancedFilterEnabled = config.features.advancedFilter.isEnabled;

    if (!isAdvancedFilterEnabled && !pagination.isVisible) {
      return null;
    }

    return (
      <Flex alignItems="center" gap={ 6 }>
        { isAdvancedFilterEnabled && (
          <LinkInternal
            href="/advanced-filter"
            alignItems="center"
            display="flex"
            gap={ 1 }
          >
            <IconSvg name="filter" boxSize={ 5 }/>
            Advanced filter
          </LinkInternal>
        ) }
        { pagination.isVisible && <Pagination my={ 1 } { ...pagination }/> }
      </Flex>
    );
  })();

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? `${ config.chain.name } transactions` : 'Transactions' }
        withTextAd
      />
      <RoutedTabs
        tabs={ tabs }
        tabListProps={ isMobile ? undefined : TAB_LIST_PROPS }
        rightSlot={ rightSlot }
        stickyEnabled={ !isMobile }
      />
    </>
  );
};

export default UTXOTransactions;
