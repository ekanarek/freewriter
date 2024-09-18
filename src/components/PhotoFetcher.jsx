export default function PhotoFetcher({ photo }) {

  return (
    <div>
      {photo ? (
        <div>
          <img src={photo.urls.small} alt={photo.alt_description} />
          <p><a href={photo.user.links.html}>© {photo.user.name} on Unsplash</a></p>
        </div>
      ) : (
        <p>Loading photo...</p>
      )}
    </div>
  );
}
