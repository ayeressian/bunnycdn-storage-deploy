# bunnycdn-storage-deploy

This action deploys selected directory to BunnyCDN storage. 

## Inputs

### `source`

**Required** The source directory folder.

### `storageZoneName`

**Required** The name of your storage zone where you are connecting to.

### `apiKey`

**Required** The storage API key.

## Example usage
````
- name: Deploy to BunnyCDN
  uses: ayeressian/bunnycdn-storage-deploy@master
  with:
    source: "dist"
    storageZoneName: "myzone"
    accessKey: "${{ secrets.BUNNY_CDN_STORAGE_KEY }}"
````
