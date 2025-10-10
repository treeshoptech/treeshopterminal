'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';
import styles from './page.module.css';

export default function SettingsPage() {
  const company = useQuery(api.companies.get, { clerkOrgId: 'org_mock123' });
  const updateSettings = useMutation(api.companies.updateSettings);

  const [settings, setSettings] = useState({
    profitMargin: company?.defaultSettings?.profitMargin || 0.5,
    travelRate: company?.defaultSettings?.travelRate || 0.5,
    bufferPercent: company?.defaultSettings?.bufferPercent || 0.1,
    burdenMultiplier: company?.defaultSettings?.burdenMultiplier || 1.7,
    timezone: company?.defaultSettings?.timezone || 'America/New_York',
    currency: company?.defaultSettings?.currency || 'USD',
  });

  const handleSave = async () => {
    await updateSettings({
      clerkOrgId: 'org_mock123',
      defaultSettings: settings,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Business Settings</h1>
        <p className={styles.subtitle}>
          Default settings that apply to all projects and calculations
        </p>
      </div>

      <div className={styles.layout}>
        <Card>
          <CardHeader>
            <CardTitle>Pricing Defaults</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.fields}>
              <Input
                label="Target Profit Margin (%)"
                type="number"
                step="1"
                value={(settings.profitMargin * 100).toString()}
                onChange={(e) => setSettings({
                  ...settings,
                  profitMargin: parseFloat(e.target.value) / 100
                })}
                helpText="Default: 50% (your legendary formula standard)"
              />

              <Input
                label="Travel Rate (%)"
                type="number"
                step="1"
                value={(settings.travelRate * 100).toString()}
                onChange={(e) => setSettings({
                  ...settings,
                  travelRate: parseFloat(e.target.value) / 100
                })}
                helpText="Default: 50% of loadout cost for travel time"
              />

              <Input
                label="Buffer Percent (%)"
                type="number"
                step="1"
                value={(settings.bufferPercent * 100).toString()}
                onChange={(e) => setSettings({
                  ...settings,
                  bufferPercent: parseFloat(e.target.value) / 100
                })}
                helpText="Default: 10% contingency buffer"
              />

              <Input
                label="Burden Multiplier"
                type="number"
                step="0.1"
                value={settings.burdenMultiplier.toString()}
                onChange={(e) => setSettings({
                  ...settings,
                  burdenMultiplier: parseFloat(e.target.value)
                })}
                helpText="Default: 1.7x (payroll + benefits + overhead)"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label}>Timezone</label>
                <select
                  className={styles.select}
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                >
                  <option value="America/New_York">Eastern (ET)</option>
                  <option value="America/Chicago">Central (CT)</option>
                  <option value="America/Denver">Mountain (MT)</option>
                  <option value="America/Los_Angeles">Pacific (PT)</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Currency</label>
                <select
                  className={styles.select}
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                >
                  <option value="USD">USD ($)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className={styles.info}>
          <Card variant="flat">
            <CardHeader>
              <CardTitle>Settings Inheritance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={styles.infoText}>
                These settings apply as defaults to all new projects, equipment,
                and calculations. Individual items can override these values.
              </p>
              <ul className={styles.infoList}>
                <li>Projects use these margins for pricing</li>
                <li>Employees default to this burden multiplier</li>
                <li>Travel calculations use the travel rate</li>
                <li>All projects include the buffer percentage</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className={styles.actions}>
          <Button size="lg" icon={<Save className="w-4 h-4" />} onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
