const { useState, useEffect, useMemo, useRef } = React;

// --- Helper UI Components ---
const InputField = ({ label, id, value, onChange, placeholder, type = 'text', className = '', readOnly = false, error = null, required = false }) => (
    <div className={className}>
        <label htmlFor={id} className="block text-sm font-medium text-zinc-700 mb-1 capitalize">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input 
            type={type} 
            id={id} 
            value={value} 
            onChange={onChange} 
            placeholder={placeholder} 
            readOnly={readOnly} 
            className={`w-full bg-white border rounded-lg px-3 py-2 text-[#1e3228] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#598037] ${readOnly ? 'bg-gray-100 text-gray-500' : ''} ${error ? 'border-red-500' : 'border-gray-300'}`} 
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const TextareaField = ({ label, id, value, onChange, placeholder, rows = 4, error = null, required = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-zinc-700 mb-1 capitalize">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea 
            id={id} 
            value={value} 
            onChange={onChange} 
            placeholder={placeholder} 
            rows={rows} 
            className={`w-full bg-white border rounded-lg px-3 py-2 text-[#1e3228] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#598037] ${error ? 'border-red-500' : 'border-gray-300'}`} 
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const SelectField = ({ label, id, value, onChange, children, className = '' }) => (
    <div className={className}>
        {label && <label htmlFor={id} className="block text-sm font-medium text-zinc-700 mb-1 capitalize">{label}</label>}
        <select id={id} value={value} onChange={onChange} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-[#1e3228] focus:outline-none focus:ring-2 focus:ring-[#598037]">{children}</select>
    </div>
);

const CustomSelectWithDelete = ({ label, value, options, onChange, onAdd, onDelete, className = '', required = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const handleSelect = (option) => {
        onChange(option.name);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <label className="block text-sm font-medium text-zinc-700 mb-1 capitalize">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center gap-2">
                <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-[#1e3228] text-left flex justify-between items-center h-10">
                    <span>{value}</span>
                    <svg className={`w-5 h-5 transition-transform text-zinc-600 ${isOpen ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </button>
                <button type="button" onClick={onAdd} style={{ backgroundColor: '#598037' }} className="text-white font-bold rounded-full p-1.5 h-8 w-8 flex-shrink-0 hover:bg-[#4a6b2c] transition-all flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </button>
            </div>
            {isOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {options.map(option => (
                        <li key={option.id} className="flex justify-between items-center px-3 py-2 text-[#1e3228] hover:bg-gray-100 cursor-pointer group">
                            <span className="flex-grow" onClick={() => handleSelect(option)}>{option.name}</span>
                            <button type="button" onClick={() => onDelete(option)} className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const DimensionFields = ({ dimension, formData, onChange }) => {
    if (dimension === 'measurements') {
        return (
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-100 p-4 rounded-lg">
                <InputField label="Width" id="measurementW" value={formData.measurementW} onChange={onChange} type="number" placeholder="W" />
                <InputField label="Height" id="measurementH" value={formData.measurementH} onChange={onChange} type="number" placeholder="H" />
                <InputField label="Length" id="measurementL" value={formData.measurementL} onChange={onChange} type="number" placeholder="L" />
                <SelectField label="Unit" id="measurementUnit" value={formData.measurementUnit} onChange={onChange}>
                    <option value="mm">mm</option>
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                    <option value="in">in</option>
                    <option value="ft">ft</option>
                </SelectField>
            </div>
        );
    }
    if (dimension === 'weight') {
        return (
            <div className="md:col-span-2 grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
                <InputField label="Weight" id="weightValue" value={formData.weightValue} onChange={onChange} type="number" placeholder="e.g., 5.5" />
                <SelectField label="Unit" id="weightUnit" value={formData.weightUnit} onChange={onChange}>
                    <option value="kg">kg</option><option value="g">g</option><option value="lb">lb</option><option value="oz">oz</option>
                </SelectField>
            </div>
        );
    }
    if (dimension === 'volume') {
        return (
            <div className="md:col-span-2 grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
                <InputField label="Volume" id="volumeValue" value={formData.volumeValue} onChange={onChange} type="number" placeholder="e.g., 50" />
                <SelectField label="Unit" id="volumeUnit" value={formData.volumeUnit} onChange={onChange}>
                    <option value="L">L</option><option value="ml">ml</option>
                </SelectField>
            </div>
        );
    }
    if (dimension === 'size') {
         return <div className="md:col-span-2 bg-gray-100 p-4 rounded-lg"><InputField label="Size" id="sizeValue" value={formData.sizeValue} onChange={onChange} placeholder="e.g., Large or 10-gallon" /></div>;
    }
    if (dimension === 'units') {
         return <div className="md:col-span-2 bg-gray-100 p-4 rounded-lg"><InputField label="Units" id="unitsValue" value={formData.unitsValue} onChange={onChange} type="number" placeholder="e.g., 50" /></div>;
    }
    return null;
};

const AddItemModal = ({ isOpen, onClose, onSave, title, value, onChange }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-[#1e3228] mb-4">{title}</h3>
                <InputField label={`New ${title.split(' ')[2]} Name`} id="newItem" value={value} onChange={onChange} placeholder="Enter name..." />
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="bg-gray-200 text-zinc-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all">Cancel</button>
                    <button onClick={onSave} style={{ backgroundColor: '#598037' }} className="text-white font-bold py-2 px-4 rounded-lg hover:bg-[#4a6b2c] transition-all">Save</button>
                </div>
            </div>
        </div>
    );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-[#1e3228] mb-2">{title}</h3>
                <p className="text-zinc-700">{message}</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="bg-gray-200 text-zinc-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all">Cancel</button>
                    <button onClick={onConfirm} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-all">Confirm Delete</button>
                </div>
            </div>
        </div>
    );
};

const EditProductModal = ({ product, isOpen, onClose, onSave, categories, brands, suppliers, allProducts }) => {
    const [formData, setFormData] = useState(product);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        setFormData(product);
    }, [product]);
    
    useEffect(() => {
        if (!formData) return;
        const cost = parseFloat(formData.costPrice) || 0;
        const markup = parseFloat(formData.markup) || 0;
        const selling = cost * (1 + markup / 100);
        setFormData(prev => ({ ...prev, sellingPrice: selling.toFixed(2) }));
    }, [formData?.costPrice, formData?.markup]);


    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (formErrors[id]) {
            setFormErrors(prev => ({...prev, [id]: null}));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = "Name is required.";
        if (!formData.description.trim()) errors.description = "Description is required.";
        if (!formData.costPrice || parseFloat(formData.costPrice) <= 0) {
            errors.costPrice = "A valid cost price is required.";
        }
        if (formData.sku && allProducts.some(p => p.sku === formData.sku && p.category === formData.category && p.id !== formData.id)) {
            errors.sku = "This SKU already exists in this category.";
        }
        return errors;
    };

    const handleSave = () => {
        const errors = validateForm();
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            onSave(formData);
        }
    };

    if (!isOpen || !formData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold text-[#1e3228] mb-6">Edit Product</h2>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InputField label="Name" id="name" value={formData.name} onChange={handleInputChange} required={true} error={formErrors.name} />
                        <InputField label="SKU" id="sku" value={formData.sku} onChange={handleInputChange} error={formErrors.sku} />
                    </div>
                    <TextareaField label="Description" id="description" value={formData.description} onChange={handleInputChange} required={true} error={formErrors.description} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <SelectField label="Category" id="category" value={formData.category} onChange={handleInputChange}>
                            {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                        </SelectField>
                        <SelectField label="Brand" id="brand" value={formData.brand} onChange={handleInputChange}>
                            {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                        </SelectField>
                    </div>
                    <SelectField label="Preferred Supplier" id="preferredSupplier" value={formData.preferredSupplier} onChange={handleInputChange}>
                        {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </SelectField>
                    <div>
                        <SelectField label="Dimensions" id="dimensions" value={formData.dimensions} onChange={handleInputChange}>
                            <option value="weight">Weight</option>
                            <option value="measurements">Measurements</option>
                            <option value="volume">Volume</option>
                            <option value="size">Size</option>
                            <option value="units">Units</option>
                        </SelectField>
                        <div className="mt-4">
                            <DimensionFields dimension={formData.dimensions} formData={formData} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg">
                        <InputField label="Cost Price (£)" id="costPrice" value={formData.costPrice} onChange={handleInputChange} type="number" required={true} error={formErrors.costPrice} />
                        <InputField label="Mark up (%)" id="markup" value={formData.markup} onChange={handleInputChange} type="number" />
                        <InputField label="Selling Price (£)" id="sellingPrice" value={formData.sellingPrice} readOnly={true} />
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button onClick={onClose} className="bg-gray-200 text-zinc-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all">Cancel</button>
                        <button onClick={handleSave} style={{ backgroundColor: '#598037' }} className="text-white font-bold py-2 px-4 rounded-lg hover:bg-[#4a6b2c] transition-all">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const ProductForm = ({ db, userId, collection, addDoc, categories, onAddItem, brands, suppliers, onDeleteCategory, onDeleteBrand, onDeleteSupplier, onSuccess, allProducts, initialData }) => {
    const [itemType, setItemType] = useState('product');
    const initialFormState = {
        category: categories[0]?.name || '', 
        brand: brands[0]?.name || '', 
        preferredSupplier: suppliers[0]?.name || '', 
        dimensions: 'weight', name: '', sku: '', description: '',
        measurementW: '', measurementH: '', measurementL: '', measurementUnit: 'mm',
        weightValue: '', weightUnit: 'kg', sizeValue: '', unitsValue: '', volumeValue: '', volumeUnit: 'L',
        costPrice: '', markup: '', sellingPrice: '0.00'
    };
    const [formData, setFormData] = useState(initialData || initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState('');
    const appId = 'default-app-id';
    
    const [formErrors, setFormErrors] = useState({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [newItemValue, setNewItemValue] = useState('');

    useEffect(() => {
        setFormData(initialData || initialFormState);
    }, [initialData]);

    useEffect(() => {
        const cost = parseFloat(formData.costPrice) || 0;
        const markup = parseFloat(formData.markup) || 0;
        const selling = cost * (1 + markup / 100);
        setFormData(prev => ({ ...prev, sellingPrice: selling.toFixed(2) }));
    }, [formData.costPrice, formData.markup]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === 'dimensions') {
            setFormData(prev => ({ ...prev, measurementW: '', measurementH: '', measurementL: '', weightValue: '', sizeValue: '', unitsValue: '', volumeValue: '', [id]: value }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
        if (formErrors[id]) {
            setFormErrors(prev => ({...prev, [id]: null}));
        }
    };
    
    const handleAddNewClick = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewItemValue('');
        setModalType('');
    };

    const handleSaveNewItem = () => {
        if (!newItemValue.trim()) return;
        onAddItem(newItemValue, modalType);
        if (modalType === 'category') setFormData(prev => ({ ...prev, category: newItemValue }));
        else if (modalType === 'brand') setFormData(prev => ({ ...prev, brand: newItemValue }));
        else if (modalType === 'supplier') setFormData(prev => ({ ...prev, preferredSupplier: newItemValue }));
        handleCloseModal();
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = "Name is required.";
        if (!formData.description.trim()) errors.description = "Description is required.";
        if (!formData.costPrice || parseFloat(formData.costPrice) <= 0) {
            errors.costPrice = "A valid cost price is required.";
        }
        if (formData.sku && allProducts.some(p => p.sku === formData.sku && p.category === formData.category)) {
            errors.sku = "This SKU already exists in this category.";
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        if (!db || !userId) {
            setSubmissionMessage('Error: Database not connected.'); return;
        }
        setIsSubmitting(true);
        setSubmissionMessage('');
        try {
            const dataToSave = { type: itemType, ...formData, createdAt: new Date(), userId: userId };
            const collectionPath = `/artifacts/${appId}/users/${userId}/${itemType}s`;
            await addDoc(collection(db, collectionPath), dataToSave);
            onSuccess(); // Close modal on success
        } catch (error) {
            console.error("Error adding document: ", error);
            setSubmissionMessage(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{backgroundColor: '#f2f2f2'}} className="p-6 sm:p-8 rounded-xl shadow-lg h-full">
            <AddItemModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveNewItem}
                title={`Add New ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
                value={newItemValue}
                onChange={(e) => setNewItemValue(e.target.value)}
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1e3228] mb-2">Add New Item</h2>
            <p className="text-zinc-600 mb-6">Select item type and fill in the details.</p>
            
            {itemType === 'product' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InputField label="Name" id="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Japanese Maple" className="sm:col-span-1" error={formErrors.name} required={true} />
                        <InputField label="SKU" id="sku" value={formData.sku} onChange={handleInputChange} placeholder="e.g., JM-RD-001" className="sm:col-span-1" error={formErrors.sku} />
                    </div>
                    
                    <TextareaField label="Description" id="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the product..." error={formErrors.description} required={true} />
                    
                    <CustomSelectWithDelete label="Category" value={formData.category} options={categories} onChange={(val) => setFormData(p => ({...p, category: val}))} onAdd={() => handleAddNewClick('category')} onDelete={onDeleteCategory} required={true} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <CustomSelectWithDelete label="Brand" value={formData.brand} options={brands} onChange={(val) => setFormData(p => ({...p, brand: val}))} onAdd={() => handleAddNewClick('brand')} onDelete={onDeleteBrand} />
                        <CustomSelectWithDelete label="Preferred Supplier" value={formData.preferredSupplier} options={suppliers} onChange={(val) => setFormData(p => ({...p, preferredSupplier: val}))} onAdd={() => handleAddNewClick('supplier')} onDelete={onDeleteSupplier} />
                    </div>

                    <div>
                        <SelectField label="Dimensions" id="dimensions" value={formData.dimensions} onChange={handleInputChange}>
                            <option value="weight">Weight</option>
                            <option value="measurements">Measurements</option>
                            <option value="volume">Volume</option>
                            <option value="size">Size</option>
                            <option value="units">Units</option>
                        </SelectField>
                        <div className="mt-4">
                            <DimensionFields dimension={formData.dimensions} formData={formData} onChange={handleInputChange} />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg">
                        <InputField label="Cost Price (£)" id="costPrice" value={formData.costPrice} onChange={handleInputChange} type="number" placeholder="e.g., 10.50" error={formErrors.costPrice} required={true} />
                        <InputField label="Mark up (%)" id="markup" value={formData.markup} onChange={handleInputChange} type="number" placeholder="e.g., 50" />
                        <InputField label="Selling Price (£)" id="sellingPrice" value={formData.sellingPrice} onChange={() => {}} readOnly={true} />
                    </div>

                    <div className="pt-2">
                        <button type="submit" disabled={isSubmitting} style={{ backgroundColor: '#598037' }} className="w-full text-white font-bold py-3 px-4 rounded-lg hover:bg-[#4a6b2c] disabled:bg-gray-400 transition-all">Add Product</button>
                    </div>
                </form>
            )}
            {itemType === 'service' && (<div className="text-center py-10 px-6 bg-gray-100 rounded-lg"><h3 className="text-lg font-semibold text-[#1e3228]">Service Form Coming Soon!</h3></div>)}
            {submissionMessage && (<div className={`mt-4 text-center p-3 rounded-lg text-sm ${submissionMessage.startsWith('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{submissionMessage}</div>)}
        </div>
    );
};

const ProductList = ({ products, isLoading, onEdit, onDelete, onDuplicate }) => {
    const formatDimensions = (product) => {
        switch (product.dimensions) {
            case 'measurements':
                if (product.measurementW || product.measurementH || product.measurementL) { return `${product.measurementW || '0'}${product.measurementUnit} x ${product.measurementH || '0'}${product.measurementUnit} x ${product.measurementL || '0'}${product.measurementUnit}`; }
                return 'N/A';
            case 'weight': return product.weightValue ? `${product.weightValue}${product.weightUnit}` : 'N/A';
            case 'volume': return product.volumeValue ? `${product.volumeValue}${product.volumeUnit}` : 'N/A';
            case 'size': return product.sizeValue || 'N/A';
            case 'units': return `${product.unitsValue || '0'} units`;
            default: return 'N/A';
        }
    };
    if (isLoading) { return <div className="text-center text-zinc-600">Loading products...</div>; }
    
    return (
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left text-zinc-600">
                <thead className="text-xs text-[#1e3228] uppercase bg-gray-100">
                    <tr>
                        <th scope="col" className="px-6 py-3">Product</th>
                        <th scope="col" className="px-6 py-3">Description</th>
                        <th scope="col" className="px-6 py-3">Details</th>
                        <th scope="col" className="px-6 py-3">Pricing</th>
                        <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="px-6 py-10 text-center text-zinc-500">
                                <h3 className="font-bold text-[#1e3228] text-lg">No Products Yet</h3>
                                <p>Add a new product or adjust your filters.</p>
                            </td>
                        </tr>
                    ) : products.map(product => {
                        const cost = parseFloat(product.costPrice || 0);
                        const selling = parseFloat(product.sellingPrice || 0);

                        return (
                        <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                            <th scope="row" className="px-6 py-4 font-bold text-[#1e3228] whitespace-nowrap">
                                {product.name}
                                <span className="block font-normal text-zinc-500 font-mono text-xs">{product.sku || 'N/A'}</span>
                            </th>
                            <td className="px-6 py-4 max-w-xs truncate" title={product.description}>{product.description}</td>
                            <td className="px-6 py-4 text-xs">
                                <span className="font-semibold">Category:</span> {product.category}<br/>
                                <span className="font-semibold">Brand:</span> {product.brand}<br/>
                                <span className="font-semibold">Supplier:</span> {product.preferredSupplier}<br/>
                                <span className="font-semibold">Dimensions:</span> {formatDimensions(product)}
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-lg font-bold" style={{color: '#598037'}}>£{selling.toFixed(2)}</div>
                                <div className="text-xs text-zinc-500">Cost: £{cost.toFixed(2)}</div>
                                <div className="text-xs text-zinc-500 font-semibold">Mark up: {product.markup || 0}%</div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center gap-3 justify-end">
                                    <button onClick={() => onDuplicate(product)} className="text-gray-400 hover:text-[#598037]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 3.375l-3.172-3.172a4.5 4.5 0 00-6.364 0L7.5 11.25l6.364 6.364a4.5 4.5 0 006.364 0z" /></svg></button>
                                    <button onClick={() => onEdit(product)} className="text-gray-400 hover:text-[#598037]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></button>
                                    <button onClick={() => onDelete(product.id)} className="text-gray-400 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                                </div>
                            </td>
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
    );
};

function App() {
    const [fbServices, setFbServices] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const appId = 'default-app-id';

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [brandFilter, setBrandFilter] = useState('All Brands');
    const [supplierFilter, setSupplierFilter] = useState('All Suppliers');

    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    const [toastMessage, setToastMessage] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [productToDuplicate, setProductToDuplicate] = useState(null);

    useEffect(() => {
        if (window.firebaseServices) {
            const { auth, onAuthStateChanged, signInAnonymously } = window.firebaseServices;
            setFbServices(window.firebaseServices);
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) setUserId(user.uid);
                else signInAnonymously(auth).catch(err => console.error("Sign-in failed", err));
                setIsAuthReady(true);
            });
            return () => unsubscribe();
        } else { setIsAuthReady(true); }
    }, []);

    useEffect(() => {
        if (fbServices && userId) {
            const { db, collection, onSnapshot, addDoc } = fbServices;
            
            const setupCollection = (collName, setter, defaultItems) => {
                const collRef = collection(db, `/artifacts/${appId}/users/${userId}/${collName}`);
                return onSnapshot(collRef, (snapshot) => {
                    if (snapshot.empty && defaultItems.length > 0) {
                        defaultItems.forEach(item => addDoc(collRef, { name: item }));
                    } else {
                        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        setter(items);
                    }
                });
            };

            const unsubCategories = setupCollection('categories', setCategories, ['Plants', 'Hardscaping', 'Tools', 'Soil & Mulch', 'Lighting']);
            const unsubBrands = setupCollection('brands', setBrands, ['Generic', 'Scotts', 'DeWalt', 'Belgard', 'Kichler']);
            const unsubSuppliers = setupCollection('suppliers', setSuppliers, ['Local Nursery', 'Big Box Store', 'Online Retailer', 'Specialty Supplier']);
            
            const unsubProducts = onSnapshot(collection(db, `/artifacts/${appId}/users/${userId}/products`), (snapshot) => {
                const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productsData);
                setIsLoadingProducts(false);
            });

            return () => {
                unsubCategories();
                unsubBrands();
                unsubSuppliers();
                unsubProducts();
            };
        }
    }, [fbServices, userId]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const categoryMatch = categoryFilter === 'All Categories' || product.category === categoryFilter;
            const brandMatch = brandFilter === 'All Brands' || product.brand === brandFilter;
            const supplierMatch = supplierFilter === 'All Suppliers' || product.preferredSupplier === supplierFilter;
            return categoryMatch && brandMatch && supplierMatch;
        });
    }, [products, categoryFilter, brandFilter, supplierFilter]);

    const handleAddItem = async (name, type) => {
        const { db, collection, addDoc } = window.firebaseServices;
        const collectionName = type === 'category' ? 'categories' : (type === 'supplier' ? 'suppliers' : `${type}s`);
        const collRef = collection(db, `/artifacts/${appId}/users/${userId}/${collectionName}`);
        await addDoc(collRef, { name });
    };

    const handleDeleteItem = (item, type) => {
        const collectionName = type === 'category' ? 'categories' : (type === 'supplier' ? 'suppliers' : `${type}s`);
        const propertyName = type === 'supplier' ? 'preferredSupplier' : type;

        const isItemInUse = products.some(p => p[propertyName] === item.name);
        if (isItemInUse) {
            setToastMessage(`Cannot delete "${item.name}" as it is currently in use.`);
            setTimeout(() => setToastMessage(''), 3000);
            return;
        }

        setConfirmModal({
            isOpen: true,
            title: `Delete ${type}?`,
            message: `Are you sure you want to delete "${item.name}"? This cannot be undone.`,
            onConfirm: async () => {
                const { db, doc, deleteDoc } = window.firebaseServices;
                const docRef = doc(db, `/artifacts/${appId}/users/${userId}/${collectionName}`, item.id);
                await deleteDoc(docRef);
                
                if (type === 'category' && categoryFilter === item.name) setCategoryFilter('All Categories');
                if (type === 'brand' && brandFilter === item.name) setBrandFilter('All Brands');
                if (type === 'supplier' && supplierFilter === item.name) setSupplierFilter('All Suppliers');

                setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
            }
        });
    };

    const handleDeleteProduct = (productId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Product?',
            message: 'Are you sure you want to delete this product?',
            onConfirm: async () => {
                const { db, doc, deleteDoc } = window.firebaseServices;
                const docRef = doc(db, `/artifacts/${appId}/users/${userId}/products`, productId);
                await deleteDoc(docRef);
                setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
            }
        });
    };
    
    const handleUpdateProduct = async (updatedProductData) => {
        const { db, doc, updateDoc } = window.firebaseServices;
        const docRef = doc(db, `/artifacts/${appId}/users/${userId}/products`, updatedProductData.id);
        await updateDoc(docRef, updatedProductData);
        setEditingProduct(null);
    };

    const handleDuplicateProduct = (product) => {
        setProductToDuplicate({ ...product, name: `${product.name} (Copy)`, sku: '' });
        setIsAddModalOpen(true);
    };

    if (!window.firebaseServices) return null;

    return (
        <div className="bg-white min-h-screen w-full font-sans text-[#1e3228] p-4 sm:p-6 lg-p-8">
            <ConfirmModal 
                isOpen={confirmModal.isOpen} 
                onClose={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
            />
            <EditProductModal 
                isOpen={!!editingProduct}
                onClose={() => setEditingProduct(null)}
                onSave={handleUpdateProduct}
                product={editingProduct}
                categories={categories}
                brands={brands}
                suppliers={suppliers}
                allProducts={products}
            />
            {isAddModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto relative">
                        <button onClick={() => { setIsAddModalOpen(false); setProductToDuplicate(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <ProductForm 
                            db={fbServices?.db} 
                            userId={userId} 
                            collection={fbServices?.collection} 
                            addDoc={fbServices?.addDoc}
                            categories={categories} 
                            onAddItem={handleAddItem}
                            brands={brands} 
                            suppliers={suppliers}
                            onDeleteCategory={(cat) => handleDeleteItem(cat, 'category')}
                            onDeleteBrand={(brand) => handleDeleteItem(brand, 'brand')}
                            onDeleteSupplier={(sup) => handleDeleteItem(sup, 'supplier')}
                            onSuccess={() => { setIsAddModalOpen(false); setProductToDuplicate(null); }}
                            allProducts={products}
                            initialData={productToDuplicate}
                        />
                    </div>
                 </div>
            )}

            {toastMessage && <div className="fixed top-5 right-5 bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg z-50">{toastMessage}</div>}
            
            <div className="max-w-7xl mx-auto">
                <div className="text-center text-xs text-zinc-500 mb-4">
                    User ID: <span className="font-semibold text-zinc-700">{userId || 'Connecting...'}</span>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                     <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                         <h2 className="text-2xl sm:text-3xl font-bold text-[#1e3228]">Your Products</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full sm:w-auto">
                             <SelectField id="categoryFilter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                                <option value="All Categories">All Categories</option>
                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                             </SelectField>
                             <SelectField id="brandFilter" value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
                                <option value="All Brands">All Brands</option>
                                {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                             </SelectField>
                             <SelectField id="supplierFilter" value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)}>
                                <option value="All Suppliers">All Suppliers</option>
                                {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                             </SelectField>
                         </div>
                         <button onClick={() => { setProductToDuplicate(null); setIsAddModalOpen(true); }} style={{ backgroundColor: '#598037' }} className="text-white font-bold py-2 px-4 rounded-lg hover:bg-[#4a6b2c] transition-all whitespace-nowrap">+ New Product</button>
                     </div>
                     <ProductList products={filteredProducts} isLoading={isLoadingProducts} onEdit={setEditingProduct} onDelete={handleDeleteProduct} onDuplicate={handleDuplicateProduct} />
                </div>
            </div>
        </div>
    );
}

if (window.firebaseServices) {
    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
}


