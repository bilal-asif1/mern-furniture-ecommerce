const STORAGE_PREFIX = 'junaid-furniture:listing-position:';

function getStorageKey(locationKey) {
  return `${STORAGE_PREFIX}${locationKey}`;
}

export function saveListingPosition(locationKey, state) {
  if (typeof window === 'undefined' || !locationKey) return;

  try {
    window.sessionStorage.setItem(getStorageKey(locationKey), JSON.stringify({
      pathname: state.pathname || '',
      productSlug: state.productSlug || '',
      containerId: state.containerId || '',
      pageScrollY: Number.isFinite(state.pageScrollY) ? Math.max(0, Math.round(state.pageScrollY)) : null,
      cardTop: Number.isFinite(state.cardTop) ? Math.round(state.cardTop) : null,
      containerScrollLeft: Number.isFinite(state.containerScrollLeft) ? Math.max(0, Math.round(state.containerScrollLeft)) : null,
    }));
  } catch (_error) {
    // Ignore storage failures and fall back to normal navigation.
  }
}

export function readListingPosition(locationKey) {
  if (typeof window === 'undefined' || !locationKey) return null;

  try {
    const value = window.sessionStorage.getItem(getStorageKey(locationKey));
    if (!value) return null;

    const parsed = JSON.parse(value);
    return {
      pathname: parsed.pathname || '',
      productSlug: parsed.productSlug || '',
      containerId: parsed.containerId || '',
      pageScrollY: Number.isFinite(parsed.pageScrollY) ? parsed.pageScrollY : null,
      cardTop: Number.isFinite(parsed.cardTop) ? parsed.cardTop : null,
      containerScrollLeft: Number.isFinite(parsed.containerScrollLeft) ? parsed.containerScrollLeft : null,
    };
  } catch (_error) {
    return null;
  }
}
