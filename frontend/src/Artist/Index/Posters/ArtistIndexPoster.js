import PropTypes from 'prop-types';
import React, { Component } from 'react';
import getRelativeDate from 'Utilities/Date/getRelativeDate';
import { icons } from 'Helpers/Props';
import IconButton from 'Components/Link/IconButton';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import Label from 'Components/Label';
import Link from 'Components/Link/Link';
import ArtistPoster from 'Artist/ArtistPoster';
import EditArtistModalConnector from 'Artist/Edit/EditArtistModalConnector';
import DeleteArtistModal from 'Artist/Delete/DeleteArtistModal';
import ArtistIndexProgressBar from 'Artist/Index/ProgressBar/ArtistIndexProgressBar';
import ArtistIndexPosterInfo from './ArtistIndexPosterInfo';
import styles from './ArtistIndexPoster.css';

class ArtistIndexPoster extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isEditArtistModalOpen: false,
      isDeleteArtistModalOpen: false
    };
  }

  //
  // Listeners

  onEditArtistPress = () => {
    this.setState({ isEditArtistModalOpen: true });
  }

  onEditArtistModalClose = () => {
    this.setState({ isEditArtistModalOpen: false });
  }

  onDeleteArtistPress = () => {
    this.setState({
      isEditArtistModalOpen: false,
      isDeleteArtistModalOpen: true
    });
  }

  onDeleteArtistModalClose = () => {
    this.setState({ isDeleteArtistModalOpen: false });
  }

  //
  // Render

  render() {
    const {
      style,
      id,
      artistName,
      monitored,
      status,
      nameSlug,
      nextAiring,
      trackCount,
      trackFileCount,
      images,
      posterWidth,
      posterHeight,
      detailedProgressBar,
      showTitle,
      showMonitored,
      showQualityProfile,
      qualityProfile,
      showRelativeDates,
      shortDateFormat,
      timeFormat,
      isRefreshingArtist,
      onRefreshArtistPress,
      ...otherProps
    } = this.props;

    const {
      isEditArtistModalOpen,
      isDeleteArtistModalOpen
    } = this.state;

    const link = `/artist/${nameSlug}`;

    const elementStyle = {
      width: `${posterWidth}px`,
      height: `${posterHeight}px`
    };

    return (
      <div className={styles.container} style={style}>
        <div className={styles.content}>
          <div className={styles.posterContainer}>
            <Label className={styles.controls}>
              <SpinnerIconButton
                className={styles.action}
                name={icons.REFRESH}
                title="Refresh Artist"
                isSpinning={isRefreshingArtist}
                onPress={onRefreshArtistPress}
              />

              <IconButton
                className={styles.action}
                name={icons.EDIT}
                title="Edit Artist"
                onPress={this.onEditArtistPress}
              />
            </Label>

            {
              status === 'ended' &&
                <div
                  className={styles.ended}
                  title="Ended"
                />
            }

            <Link
              className={styles.link}
              style={elementStyle}
              to={link}
            >
              <ArtistPoster
                className={styles.poster}
                style={elementStyle}
                images={images}
                size={250}
                lazy={false}
                overflow={true}
              />
            </Link>
          </div>

          <ArtistIndexProgressBar
            monitored={monitored}
            status={status}
            trackCount={trackCount}
            trackFileCount={trackFileCount}
            posterWidth={posterWidth}
            detailedProgressBar={detailedProgressBar}
          />

          {
            showTitle &&
              <div className={styles.title}>
                {artistName}
              </div>
          }

          {
            showMonitored &&
              <div className={styles.title}>
                {monitored ? 'Monitored' : 'Unmonitored'}
              </div>
          }

          {
            showQualityProfile &&
              <div className={styles.title}>
                {qualityProfile.name}
              </div>
          }

          <div className={styles.nextAiring}>
            {
              getRelativeDate(
                nextAiring,
                shortDateFormat,
                showRelativeDates,
                {
                  timeFormat,
                  timeForToday: true
                }
              )
            }
          </div>

          <ArtistIndexPosterInfo
            qualityProfile={qualityProfile}
            showQualityProfile={showQualityProfile}
            showRelativeDates={showRelativeDates}
            shortDateFormat={shortDateFormat}
            timeFormat={timeFormat}
            {...otherProps}
          />

          <EditArtistModalConnector
            isOpen={isEditArtistModalOpen}
            artistId={id}
            onModalClose={this.onEditArtistModalClose}
            onDeleteArtistPress={this.onDeleteArtistPress}
          />

          <DeleteArtistModal
            isOpen={isDeleteArtistModalOpen}
            artistId={id}
            onModalClose={this.onDeleteArtistModalClose}
          />
        </div>
      </div>
    );
  }
}

ArtistIndexPoster.propTypes = {
  style: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  artistName: PropTypes.string.isRequired,
  monitored: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  nameSlug: PropTypes.string.isRequired,
  nextAiring: PropTypes.string,
  trackCount: PropTypes.number,
  trackFileCount: PropTypes.number,
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  posterWidth: PropTypes.number.isRequired,
  posterHeight: PropTypes.number.isRequired,
  detailedProgressBar: PropTypes.bool.isRequired,
  showTitle: PropTypes.bool.isRequired,
  showMonitored: PropTypes.bool.isRequired,
  showQualityProfile: PropTypes.bool.isRequired,
  qualityProfile: PropTypes.object.isRequired,
  showRelativeDates: PropTypes.bool.isRequired,
  shortDateFormat: PropTypes.string.isRequired,
  timeFormat: PropTypes.string.isRequired,
  isRefreshingArtist: PropTypes.bool.isRequired,
  onRefreshArtistPress: PropTypes.func.isRequired
};

ArtistIndexPoster.defaultProps = {
  trackCount: 0,
  trackFileCount: 0
};

export default ArtistIndexPoster;
