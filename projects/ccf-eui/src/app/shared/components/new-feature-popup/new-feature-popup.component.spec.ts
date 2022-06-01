import { Shallow } from 'shallow-render';
import { NewFeaturePopupComponent } from './new-feature-popup.component';
import { NewFeaturePopupModule } from './new-feature-popup.module';


describe('NewFeaturePopupComponent', () => {
  let shallow: Shallow<NewFeaturePopupComponent>;

  beforeEach(() => {
    shallow = new Shallow(NewFeaturePopupComponent, NewFeaturePopupModule);
  });

  it('creates', async () => {
    const { instance } = await shallow.render();
    expect(instance).toBeDefined();
  });
});
