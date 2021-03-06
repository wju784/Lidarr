import _ from 'lodash';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createSelector } from 'reselect';
import createAllArtistSelector from 'Store/Selectors/createAllArtistSelector';
import ArtistSearchInput from './ArtistSearchInput';

function createMapStateToProps() {
  return createSelector(
    createAllArtistSelector(),
    (artist) => {
      return {
        artist: _.sortBy(artist, 'sortName')
      };
    }
  );
}

function createMapDispatchToProps(dispatch, props) {
  return {
    onGoToArtist(nameSlug) {
      dispatch(push(`${window.Sonarr.urlBase}/artist/${nameSlug}`));
    },

    onGoToAddNewArtist(query) {
      dispatch(push(`${window.Sonarr.urlBase}/add/new?term=${encodeURIComponent(query)}`));
    }
  };
}

export default connect(createMapStateToProps, createMapDispatchToProps)(ArtistSearchInput);
