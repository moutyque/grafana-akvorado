import { test, expect } from '@grafana/plugin-e2e';

test('"Save & test" should be successful when configuration is valid', async ({
  createDataSourceConfigPage,
  readProvisionedDataSource,
  selectors,
  page,
}) => {
  const ds = await readProvisionedDataSource({ fileName: 'datasources.yml' });
  const configPage = await createDataSourceConfigPage({ type: ds.type });
  const healthCheckPath = `${selectors.apis.DataSource.proxy(
    configPage.datasource.uid,
    configPage.datasource.id.toString()
  )}/api/v0/healthcheck`;
  console.log("test1: healthCheckPath: " +healthCheckPath)
  await page.route(healthCheckPath, async (route) => await route.fulfill({ status: 200, body: 'OK' }));
  await expect(configPage.saveAndTest({ path: healthCheckPath })).toBeOK();
});

test('"Save & test" should display success alert box when config is valid', async ({
  createDataSourceConfigPage,
  readProvisionedDataSource,
  selectors,
}) => {
  const ds = await readProvisionedDataSource({ fileName: 'datasources.yml' });
  const configPage = await createDataSourceConfigPage({ type: ds.type });
  const healthCheckPath = `${selectors.apis.DataSource.proxy(
    configPage.datasource.uid,
    configPage.datasource.id.toString()
  )}/api/v0/healthcheck`;
  console.log("test2: healthCheckPath: " +healthCheckPath)
  await expect(configPage.saveAndTest({ path: healthCheckPath })).not.toBeOK();
  expect(configPage).toHaveAlert('error');
});
