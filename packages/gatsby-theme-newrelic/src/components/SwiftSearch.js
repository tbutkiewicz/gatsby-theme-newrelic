import React from 'react';
import SiteSearchAPIConnector from '@elastic/search-ui-site-search-connector';
import {
  SearchProvider,
  WithSearch,
  SearchBox,
  Results,
  Paging,
  PagingInfo,
} from '@elastic/react-search-ui';
import ResultView from './ResultView';
import PagingInfoView from './PagingInfoView';
import SearchInput from './SearchInput';

import styled from '@emotion/styled';
import { css } from '@emotion/core';
import PropTypes from 'prop-types';

// TODO: move styles to emotion/wrapper
import Icon from './Icon';
import styles from '../styles/SwiftSearchStyles';

const connector = new SiteSearchAPIConnector({
  documentType: 'page',
  engineKey: 'Ad9HfGjDw4GRkcmJjUut',
});

const configOptions = {
  apiConnector: connector,
  searchQuery: {
    result_fields: {
      title: {
        snippet: {
          size: 100,
          fallback: true,
        },
      },
      body: {
        snippet: {
          size: 400,
          fallback: true,
        },
      },
      url: {
        raw: {},
      },
    },
  },
  initialState: {
    resultsPerPage: 10,
  },
};

const SwiftSearch = ({ className }) => {
  return (
    <div css={styles} className={className}>
      <SearchProvider config={configOptions}>
        <WithSearch
          mapContextToProps={({ isLoading, results, searchTerm }) => ({
            isLoading,
            results,
            searchTerm,
          })}
        >
          {({ isLoading, results, searchTerm }) => {
            const hasResults = !isLoading && results && results.length > 0;
            const hasSearched = !isLoading && searchTerm.length > 0;
            return (
              <>
                <SearchBox
                  searchAsYouType
                  debounceLength={500}
                  inputView={InputView}
                />
                {isLoading && (
                  <Icon
                    css={css`
                      margin-top: 1rem;
                    `}
                    size="1.5rem"
                    name={Icon.TYPE.LOADER}
                  />
                )}
                {hasSearched && (
                  <>
                    <StyledPagingInfo view={PagingInfoView} />

                    {hasResults && (
                      <StyledResultsContainer>
                        <StyledResults
                          resultView={ResultView}
                          titleField="title"
                          urlField="url"
                        />
                        <StyledPaging />
                      </StyledResultsContainer>
                    )}
                  </>
                )}
              </>
            );
          }}
        </WithSearch>
      </SearchProvider>
    </div>
  );
};

function InputView({ getAutocomplete, getInputProps }) {
  const inputProps = getInputProps();
  return (
    <>
      <div
        className="sui-search-box__wrapper"
        css={css`
          .sui-search-box__text-input {
            border: none;
            padding: 0;
          }
        `}
      >
        <SearchInput size={SearchInput.SIZE.LARGE} {...inputProps} />
        {getAutocomplete()}
      </div>
    </>
  );
}

SwiftSearch.propTypes = {
  className: PropTypes.string,
};

InputView.propTypes = {
  className: PropTypes.string,
  getAutocomplete: PropTypes.func,
  getInputProps: PropTypes.func,
};

const StyledResultsContainer = styled.div``;

const StyledPagingInfo = styled(PagingInfo)``;

const StyledPaging = styled(Paging)``;

const StyledResults = styled(Results)``;

export default SwiftSearch;
