import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../config/tokens';
import { api, ProductListing } from '../services/api';

export const MarketplaceScreen: React.FC = () => {
  const [products, setProducts] = useState<ProductListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductListing | null>(null);

  // Sell Modal
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('brand_new');
  const [location, setLocation] = useState('Nairobi');
  const [stock, setStock] = useState('1');
  const [desc, setDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (e) {
      console.warn('Failed to load products', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSellProduct = async () => {
    if (!title.trim() || !price.trim() || !desc.trim()) {
      Alert.alert('Required Fields', 'Please fill in product title, price, and description.');
      return;
    }
    try {
      setSubmitting(true);
      await api.createProduct({
        title,
        category: 1,
        price: parseInt(price, 10),
        condition,
        location,
        stock_quantity: parseInt(stock, 10) || 1,
        description: desc,
      });
      Alert.alert('Success! 🛍️', 'Your product has been listed on the marketplace.');
      setSellModalVisible(false);
      setTitle('');
      setPrice('');
      setDesc('');
      fetchProducts();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Please log in as a seller to list products.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.category_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerTop}>
          <Text style={styles.bannerTitle}>🛍️ CheremoSphere Market</Text>
          <TouchableOpacity style={styles.sellBtn} onPress={() => setSellModalVisible(true)}>
            <Text style={styles.sellBtnText}>+ Sell Product</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchBar}
          placeholder="Search electronics, food, fashion, phones..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Product Grid */}
      {loading ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color={Colors.primaryOrange} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSelectedProduct(item)}
              activeOpacity={0.8}
            >
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imageIcon}>📦</Text>
                <View style={styles.conditionTag}>
                  <Text style={styles.conditionTagText}>
                    {item.condition === 'brand_new' ? 'Brand New' : 'Used'}
                  </Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.productPrice}>KES {item.price.toLocaleString()}</Text>
                <Text style={styles.productTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.productLocation}>📍 {item.location}</Text>
                <Text style={styles.sellerName}>👤 {item.seller_name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Product Detail Modal */}
      <Modal visible={!!selectedProduct} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailTitle}>{selectedProduct?.title}</Text>
                <Text style={styles.detailPrice}>KES {selectedProduct?.price.toLocaleString()}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedProduct(null)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.metaRow}>
                <Text style={styles.metaBadge}>📍 {selectedProduct?.location}</Text>
                <Text style={styles.metaBadge}>Condition: {selectedProduct?.condition}</Text>
                <Text style={styles.metaBadge}>Stock: {selectedProduct?.stock_quantity}</Text>
              </View>

              <Text style={styles.subHeading}>Seller Information</Text>
              <Text style={styles.sellerDetailText}>👤 {selectedProduct?.seller_name}</Text>

              <Text style={styles.subHeading}>Product Description</Text>
              <Text style={styles.detailText}>{selectedProduct?.description}</Text>

              <View style={styles.contactActions}>
                <TouchableOpacity
                  style={styles.waBtn}
                  onPress={() => {
                    const phone = selectedProduct?.seller_phone
                      ? selectedProduct.seller_phone.replace('+', '')
                      : '254719678760';
                    Linking.openURL(
                      `https://wa.me/${phone}?text=Hello%2C+I+am+interested+in+your+listing+${encodeURIComponent(
                        selectedProduct?.title || ''
                      )}+on+CheremoSphere`
                    );
                  }}
                >
                  <Text style={styles.waBtnText}>💬 WhatsApp Seller</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => {
                    const phone = selectedProduct?.seller_phone || '0719678760';
                    Linking.openURL(`tel:${phone}`);
                  }}
                >
                  <Text style={styles.callBtnText}>📞 Call Seller</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Sell Product Modal */}
      <Modal visible={sellModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sell on Marketplace</Text>
              <TouchableOpacity onPress={() => setSellModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Product Title *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. iPhone 13 128GB, Fresh Honey 1L"
                value={title}
                onChangeText={setTitle}
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Price (KES) *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 45000"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Location *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Nairobi CBD"
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Product Description *</Text>
              <TextInput
                style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
                multiline
                placeholder="Details, specs, condition, delivery terms..."
                value={desc}
                onChangeText={setDesc}
              />

              <TouchableOpacity
                style={[styles.publishBtn, submitting && { opacity: 0.6 }]}
                onPress={handleSellProduct}
                disabled={submitting}
              >
                <Text style={styles.publishBtnText}>
                  {submitting ? 'Publishing...' : '🚀 Publish Product Listing'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBg,
  },
  banner: {
    backgroundColor: Colors.primaryNavy,
    padding: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  bannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.white,
  },
  sellBtn: {
    backgroundColor: Colors.primaryOrange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sellBtnText: {
    color: Colors.white,
    fontSize: 11.5,
    fontWeight: '700',
  },
  searchBar: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    fontSize: 13,
    color: Colors.darkText,
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 12,
  },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    height: 110,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imageIcon: {
    fontSize: 32,
  },
  conditionTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(13, 42, 92, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  conditionTagText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  cardBody: {
    padding: 10,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryOrange,
  },
  productTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.darkText,
    marginTop: 3,
  },
  productLocation: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 4,
  },
  sellerName: {
    fontSize: 10,
    color: Colors.mutedText,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryNavy,
  },
  detailTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.darkText,
  },
  detailPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryOrange,
    marginTop: 2,
  },
  closeBtn: {
    fontSize: 20,
    color: Colors.mutedText,
    padding: 4,
  },
  modalBody: {
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  metaBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 11,
    color: Colors.darkText,
  },
  subHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.darkText,
    marginTop: 10,
    marginBottom: 4,
  },
  sellerDetailText: {
    fontSize: 13,
    color: '#334155',
  },
  detailText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  waBtn: {
    flex: 1,
    backgroundColor: '#25D366',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  waBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  callBtn: {
    flex: 1,
    backgroundColor: Colors.primaryNavy,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  callBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  publishBtn: {
    backgroundColor: Colors.primaryOrange,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 24,
  },
  publishBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.darkText,
    marginTop: 10,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: Colors.darkText,
    backgroundColor: '#F8FAFC',
  },
});
