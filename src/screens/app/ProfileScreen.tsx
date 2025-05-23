import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, useColorScheme, Alert, ScrollView,
} from 'react-native';
import { getUserProfile, updateUserProfile, changePassword } from '../../services/users';
import { lightTheme, darkTheme } from '../../utils/theme';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  avatar?: string;
}

interface ProfileScreenProps {
  navigation: any;
  token: string;
  onLogout: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, token, onLogout }) => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  
  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const loadProfile = async () => {
    setLoading(true);
    try {
      const userProfile = await getUserProfile(token);
      setProfile(userProfile);
      setName(userProfile.name || '');
      setEmail(userProfile.email || '');
      setPhone(userProfile.phone || '');
      setAddress(userProfile.address || '');
      setCity(userProfile.city || '');
      setCountry(userProfile.country || '');
    } catch (e) {
      console.error('Error loading profile:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updatedProfile = await updateUserProfile(token, {
        name,
        email,
        phone,
        address,
        city,
        country,
      });
      setProfile(updatedProfile);
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (e) {
      console.error('Error updating profile:', e);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      await changePassword(token, currentPassword, newPassword);
      setShowPasswordChange(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Success', 'Password changed successfully!');
    } catch (e) {
      console.error('Error changing password:', e);
      Alert.alert('Error', 'Failed to change password. Please check your current password.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: onLogout
        },
      ]
    );
  };

  const resetForm = () => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setCity(profile.city || '');
      setCountry(profile.country || '');
    }
    setEditing(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={[styles.logoutButton, { color: theme.colors.primary }]}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.profileCard, { borderColor: theme.colors.border }]}>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Name</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={name}
            onChangeText={setName}
            editable={editing}
            placeholder="Enter your name"
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Email</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={email}
            onChangeText={setEmail}
            editable={editing}
            placeholder="Enter your email"
            placeholderTextColor={theme.colors.placeholder}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Phone</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={phone}
            onChangeText={setPhone}
            editable={editing}
            placeholder="Enter your phone number"
            placeholderTextColor={theme.colors.placeholder}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Address</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={address}
            onChangeText={setAddress}
            editable={editing}
            placeholder="Enter your address"
            placeholderTextColor={theme.colors.placeholder}
            multiline
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>City</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={city}
            onChangeText={setCity}
            editable={editing}
            placeholder="Enter your city"
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Country</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={country}
            onChangeText={setCountry}
            editable={editing}
            placeholder="Enter your country"
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View style={styles.buttonContainer}>
          {editing ? (
            <>
              <TouchableOpacity
                onPress={handleSaveProfile}
                style={[styles.button, styles.saveButton, { backgroundColor: theme.colors.secondary }]}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.buttonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={resetForm}
                style={[styles.button, styles.cancelButton, { borderColor: theme.colors.border }]}
              >
                <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={() => setEditing(true)}
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={[styles.section, { borderColor: theme.colors.border }]}>
        <TouchableOpacity
          onPress={() => setShowPasswordChange(!showPasswordChange)}
          style={styles.sectionHeader}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Change Password</Text>
          <Text style={[styles.toggleText, { color: theme.colors.primary }]}>
            {showPasswordChange ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>

        {showPasswordChange && (
          <View style={styles.passwordForm}>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Current Password"
              placeholderTextColor={theme.colors.placeholder}
              secureTextEntry
            />
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New Password"
              placeholderTextColor={theme.colors.placeholder}
              secureTextEntry
            />
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm New Password"
              placeholderTextColor={theme.colors.placeholder}
              secureTextEntry
            />
            <TouchableOpacity
              onPress={handleChangePassword}
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={[styles.section, { borderColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.navigate('OrderHistory', { token })}>
          <Text style={[styles.menuItem, { color: theme.colors.text }]}>Order History</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings', { token })}>
          <Text style={[styles.menuItem, { color: theme.colors.text }]}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Help', { token })}>
          <Text style={[styles.menuItem, { color: theme.colors.text }]}>Help & Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  profileCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  saveButton: {
    marginRight: 8,
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
  },
  passwordForm: {
    marginTop: 16,
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
});

export default ProfileScreen;